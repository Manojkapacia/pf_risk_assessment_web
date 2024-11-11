import '../../App.css';
import searchImage from '../../assets/images/search-image.png';
import { useNavigate } from 'react-router-dom';

function SearchComponent() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/doc-scan");
    }, 2000);

    return (
        <div className="container">
            <div className="row">
                <div className="d-flex flex-column  justify-content-center align-items-center vh-100">
                    <img src={searchImage} alt="Finding Documents" />
                </div>
            </div>
        </div>
    );
}

export default SearchComponent;