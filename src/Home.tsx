import { Link } from 'react-router-dom';
import { ManagementEndpointType } from './Manage';
import { components } from "./Query-Engine-Schema";

interface HomeProps {
    designMode :  boolean
    , managementEndpoints: ManagementEndpointType[] | null
    , apiUrl : string | null
    , available: components["schemas"]["PipelineDir"]
    , docs: components["schemas"]["DocDir"] | null
}

function Home(props : HomeProps) {
    return (
        <div className="grid h-screen place-content-center">
            <div>
                { props.designMode && 
                    <Link to="/ui/design">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>Design</h2>
                            The design view lets you edit pipelines, and also change any other
                            files accessible to the query engine.
                        </div>
                    </Link>
                }
                { props.available && 
                    <Link to="/ui/test">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>Test</h2>
                            The test view lets you run a pipeline repeatedly and see the results
                            immediately.
                        </div>
                    </Link>
                }
                { props.managementEndpoints && 
                    <Link to="/ui/manage">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>Manage</h2>
                            Management endpoints for controlling or debugging the service.
                        </div>
                    </Link>
                }
                { props.docs && 
                    <Link to="/ui/help">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>Documentation</h2>
                            Access to the Query Engine documentation.
                        </div>
                    </Link>
                }
                { props.apiUrl && 
                    <Link to="/ui/api">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>API</h2>
                            API Documentation.
                        </div>
                    </Link>
                }
            </div>
        </div>
    );
}

export default Home;