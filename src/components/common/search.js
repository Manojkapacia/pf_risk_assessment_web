import '../../App.css';
import searchImage from '../../assets/images/search-image.png';

function SearchComponent() {
    return (
        <div className="container-fluid">
            <div className="row mx-5">
                <div className="col-md-6 mt-5 mt-sm-0 offset-md-3 d-flex justify-content-center align-items-center vh-100">
                    <img src={searchImage} alt="Finding Documents"  style={{ height: "22rem", width: "20rem" }}/>
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;