import React from 'react';
import imageNotFound from '../../assets/images/404 page not found.png';

function PageNotFound() {
    return (

        <div className='container'>
            <div className='row'>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    flexDirection: 'column',
                }}>
                    <img src={imageNotFound} alt="Iamge Not Found" height={'300rem'} width={'300rem'} />
                    <h4>
                    Oops looks like you have entered a wrong URL <br></br>
                    Please check again
                    </h4>
                </div>

            </div>
        </div>
    );
}

export default PageNotFound;