import HeaderPage from "../../components/HeaderHomePage/HeaderPage";
import AccountUser from "../../components/AccountUser";
import "./AccountUserPage.css";

export default function AccountUserPage() {
  return (
    <>
      <div className="account-page text-white">
        <HeaderPage />
        <AccountUser />
      </div>
    </>
  );
}
