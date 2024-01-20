import { Link } from 'react-router-dom';
import { ManagementEndpointType } from './Manage';
import { components } from "./Query-Engine-Schema";

interface HomeProps {
    designMode :  boolean
    , managementEndpoints: ManagementEndpointType[] | null
    , apiUrl : string | null
    , available: components["schemas"]["PipelineDir"] | null
    , docs: components["schemas"]["DocDir"] | null
    , profile: components["schemas"]["Profile"] | null
}

function Home(props : HomeProps) {
    return (
        <div className="grid place-content-center">
            <div className="flex flex-wrap place-content-center">
                { props.designMode && 
                    <Link to="/ui/design">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>Design</h2>
                            The design view lets you edit pipelines, and also change any other
                            files accessible to the query engine.
                        </div>
                    </Link>
                }
                { props.available && 
                    <Link to="/ui/test">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>Test</h2>
                            Run a pipeline repeatedly and see the results immediately.
                            <br/>
                            See also the "Data" menu, which simulates the Query Engine embedded in a SAAS system.
                        </div>
                    </Link>
                }
                { props.profile && 
                    <Link to="/ui/history">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>History</h2>
                            See the pipelines that you have run before.
                        </div>
                    </Link>
                }
                { props.managementEndpoints && 
                    <Link to="/ui/manage">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>Manage</h2>
                            Management endpoints for controlling or debugging the service.
                        </div>
                    </Link>
                }
                { props.docs && 
                    <Link to="/ui/help">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>Documentation</h2>
                            Access to the Query Engine documentation.
                        </div>
                    </Link>
                }
                { props.apiUrl && 
                    <Link to="/ui/api">
                        <div className="w-80 h-60 bg-zinc-100 p-4 m-10 float-left text-center">
                            <h2>API</h2>
                            API Documentation.
                        </div>
                    </Link>
                }
            </div>
            <div className="fixed bottom-0 right-0">
                { props.profile && props.profile.version }
            </div>
        </div>
    );
}

export default Home;