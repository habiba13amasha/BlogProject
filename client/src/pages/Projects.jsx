import CallToAction from "../components/CallToAction"
export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="font-semibold text-3xl">Projects</h1>
      <p className="text-gray-500 text-md">
        Build fun and engaging projects while learning HTML,CSS,JS
      </p>
      <CallToAction/>
    </div>
  )
}
