
import Feed from "@components/UI/Layout/Feed";
import UsersBar from "@components/UI/Layout/UsersBar";

export default function Home() {

  return ( 
      <div className="size-full">
        <UsersBar/>
        <Feed showResults={true}/>
      </div>
  );
}
