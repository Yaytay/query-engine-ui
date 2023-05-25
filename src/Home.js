import React from 'react';
import { Link } from 'react-router-dom';

function Home(props) {
    return (
        <div className="grid h-screen place-content-center">
            <div>
                { props.designMode && 
                    <Link to="/design">
                        <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                            <h2>Design</h2>
                            The design view lets you edit pipelines, and also change any other
                            files accessible to the query engine.
                        </div>
                    </Link>
                }
                <Link to="/test">
                    <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                        <h2>Test</h2>
                        The test view lets you run a pipeline repeatedly and see the results
                        immediately.
                    </div>
                </Link>
                <Link to="/demo">
                    <div className="w-80 bg-zinc-100 p-5 m-10 float-left text-center">
                        <h2>Demo</h2>
                        The demo view is an approximation to how you should integrate the
                        query engine into your application.
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Home;