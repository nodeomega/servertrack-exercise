using System.Web.Http;

namespace ServerTrack
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute("DefaultApiWithAction", "api/{controller}/{action}");

            config.Routes.MapHttpRoute(
                name: "DefaultApiWithID",
                routeTemplate: "api/{controller}/{id}",
                defaults: null
            );
        }
    }
}
