import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("User signed out successfully.");
            navigate("/signin");
        }).catch((error) => {
            // An error happened.
            console.log("Error signing out:", error);
        });
    };

    return (
        <div className="header">
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Header;