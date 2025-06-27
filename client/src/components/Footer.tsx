export default function Footer() {
    return (
        <footer className="w-full bg-black py-8 px-4">
            <div className="max-w-5xl mx-auto text-left sm:text-center">
                <h3 className="font-title font-title text-5xl bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">CoreChain</h3>
                <p className="text-white text-opacity-80 mb-4">
                    Empowering you for the future of decentralized technologies. Join our community and stay ahead in the Web3 revolution.
                </p>

                <div className="mx-auto w-full flex justify-center sm:items-center items-start flex-row sm:gap-4 gap-10">
                    <div className="w-full sm:w-auto">
                        <h4 className="text-blue-600 font-semibold mb-1">Resources</h4>
                        <ul className="text-white text-opacity-70 text-sm">
                            <li><a href="#" className="hover:underline">Docs</a></li>
                            <li><a href="#" className="hover:underline">Blog</a></li>
                            <li><a href="#" className="hover:underline">Support</a></li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-auto">
                        <h4 className="text-blue-600 font-semibold mb-1">Community</h4>
                        <ul className="text-white text-opacity-70 text-sm">
                            <li><a href="#" className="hover:underline">Discord</a></li>
                            <li><a href="#" className="hover:underline">Twitter</a></li>
                            <li><a href="#" className="hover:underline">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <p className="text-white text-opacity-50 text-xs mt-8">&copy; {new Date().getFullYear()} CoreChain. All rights reserved.</p>
            </div>
        </footer>
    );
}