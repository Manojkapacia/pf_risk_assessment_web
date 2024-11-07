import '../../App.css';
import serchImage from '../../images/serchImage.png';

function SearchComponent() {
    return (
        <div className="container">
            <div className="row">
                <div className="d-flex flex-column  justify-content-center align-items-center vh-100">
                    <img src={serchImage} alt="SerchImage" height="150rem" width='150rem' />
                    <div className="pfRiskheading">Searching For Your Documents</div>
                    <div className='pfRiskSubHeading'>
                        Check if your PF is at risk of getting stuck
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;