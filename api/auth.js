// GitHub OAuth proxy for Sveltia CMS
export default async function handler(req, res) {
  const { code, provider } = req.query;
  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth`;

  // Step 1: redirect to GitHub
  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'repo,user',
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2: exchange code for token
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).send(`OAuth error: ${data.error_description}`);
    }

    // Return token to CMS via postMessage
    const token = data.access_token;
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html><html><body><script>
      (function() {
        function receiveMsg(e) {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token, provider: 'github' }).replace(/'/g, "\\'")}',
            e.origin
          );
        }
        window.addEventListener('message', receiveMsg, { once: true });
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script></body></html>`);
  } catch (err) {
    res.status(500).send('OAuth error: ' + err.message);
  }
}
