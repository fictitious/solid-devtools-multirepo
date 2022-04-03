
Protected routes example adapted from [codesandbox](https://codesandbox.io/s/solid-app-router-protected-routes-o9u39) mentioned on Discord.

As was also [mentioned on Discord](https://discord.com/channels/722131463138705510/722349143024205824/955571467238666330), Route (and therefore ProtectedRoute) component is not compatible with HMR as implemented in solid-refresh. 
You have to set `{hot: false}` in vite-plugin-solid options for this example to work.

