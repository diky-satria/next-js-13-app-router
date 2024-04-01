import Navbar from "../navbar";

type Props = {
  children: React.ReactNode;
};

const Dashboard = (props: Props) => {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default Dashboard;
