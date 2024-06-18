import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login() {
  return (
    <>
      <div className="flex w-1/3 gap-3 flex-col items-start p-10">
        <p>Clg Email ID</p>
        <Input></Input>

        <Button>Login</Button>
      </div>
    </>
  );
}
export default Login;
