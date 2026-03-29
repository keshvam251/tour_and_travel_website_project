import Image from "next/image";
import Footer from "./components/Footer";
import Landingpage from "./components/landingpage";


import ReviewsPage from "./review/page";
import GalleryPage from "./components/gallery";
import BookingPage from "./booking/page";

export default function Home() {
  return (
    <>
    <Landingpage/>
    <BookingPage/>
    <ReviewsPage/>
    <GalleryPage/>
    
    
    </>
   
  );
}
