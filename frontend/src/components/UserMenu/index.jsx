import UserButton from "./UserButton";
import Header from "../../components/Header"; // Import the Header component

export default function UserMenu({ children }) {
  return (
    <div className="w-auto h-auto">
      <UserButton />
      {children}
    </div>
  );
}
