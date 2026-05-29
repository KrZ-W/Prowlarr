using NzbDrone.Core.Configuration;
using Prowlarr.Http.REST;

namespace Prowlarr.Api.V1.Config
{
    public class IndexerConfigResource : RestResource
    {
        public string IndexerCooldownPeriods { get; set; }
    }

    public static class IndexerConfigResourceMapper
    {
        public static IndexerConfigResource ToResource(IConfigService model)
        {
            return new IndexerConfigResource
            {
                IndexerCooldownPeriods = model.IndexerCooldownPeriods,
            };
        }
    }
}
