import '../../App.css';
import searchImage from '../../images/search-image.png';

function SearchComponent(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="d-flex flex-column  justify-content-center align-items-center vh-100">
                    <img src={searchImage} alt="Finding Documents" height="150rem" width='150rem' />
                    <div className="pfRiskheading">{props.MESSAGES.searchHeading}</div>
                    <div className='pfRiskSubHeading'>{props.MESSAGES.seachSubHeading}</div>
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;