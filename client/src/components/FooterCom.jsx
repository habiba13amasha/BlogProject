import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500 p-8 mt-auto">
      <div className="w-full max-w-7xl mx-auto ">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1 mb-4">
          <div className="mt-5">
            <Link to="/" className="text-lg font-semibold text-gray-800 dark:text-white sm:text-xl">
              <span className="px-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-blue-50">
                Habiba
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-4 sm:grid-cols-3 sm:gap-5 ">
            <div >
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="http://www.100jsproject.com" target="_blank" rel="noopener noreferrer">
                  100 JS Projects
                </Footer.Link>
                <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
                  Habiba Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/habiba13amasha" target="_blank" rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link href="#">
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#">
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between mt-5">
          <Footer.Copyright href="#" by="Habiba Blog" year={new Date().getFullYear()} />
          <div className="flex gap-6 mt-5 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="https://github.com/habiba13amasha" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
