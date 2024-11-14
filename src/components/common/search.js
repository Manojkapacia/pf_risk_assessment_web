import '../../App.css';
import searchImage from '../../assets/images/search-image.png';
import { useNavigate } from 'react-router-dom';

function SearchComponent() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/service-history");
    }, 2000);

    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <img src={searchImage} alt="Finding Documents" style={{ height: "22rem", width: "20rem" }}/>
            </div>
        </div>
    );
}

export default SearchComponent;