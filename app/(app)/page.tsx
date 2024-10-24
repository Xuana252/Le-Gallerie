
import Feed from "@components/UI/Feed";
import UsersBar from "@components/UI/UsersBar";

export default function Home() {

  return ( 
      <div className="size-full">
        <UsersBar/>
        <Feed showResults={true}/>
      </div>
  );
}
