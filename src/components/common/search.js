import '../../App.css';
import serchImage from '../../images/serchImage.png';

function SearchComponent(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="d-flex flex-column  justify-content-center align-items-center vh-100">
                    <img src={serchImage} alt="SerchImage" height="150rem" width='150rem' />
                    <div className="pfRiskheading">{props.MESSAGES.searchHeading}</div>
                    <div className='pfRiskSubHeading'>{props.MESSAGES.seachSubHeading}</div>
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;