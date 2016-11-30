using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ServerTrack.Startup))]
namespace ServerTrack
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
