"use client"
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <>
      <section>
        <div>
          Home Page
        </div>
        <div className="flex justify-center items-center">
          <Button onClick={() => router.push("/login")}> Login</Button>
        </div>
      </section>
    </>
  )
}