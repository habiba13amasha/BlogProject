import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about ReactJs?</h2>
        <p className="my-2 text-gray-500">Checkout these resources with ReactJs projects...</p>
        <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.geeksforgeeks.org/reactjs-projects/" target="_blank" rel="noopener noreferrer">100 ReactJs projects</a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://media.geeksforgeeks.org/wp-content/uploads/20240307175325/React-Projects-with-Source-Code-[2024].webp"/>
      </div>
    </div>
  )
}
