export function setupLogInit(server_url: string, api_version: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log({
      application: `🚀 Application is running on: ${server_url}/${api_version} `,
      documentation: `📚 Documentation is available at: ${server_url}/${api_version}/docs `,
    });
  }
}
