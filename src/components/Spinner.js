import React, {Component} from 'react';
export default class Spinner extends Component {

    render() {
        return (
        <>        
            <div className='text-center'>
                {this.props.size === "small" ?
                    <div className="spinner-border spinner-border-sm text-light ml-3" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>:
                    <div className="spinner-border spinner-border-lg text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                }
            </div>
        </>
        );
    }
}