import Image from "next/image";
import Footer from "./components/Footer";
import Landingpage from "./components/landingpage";

import PackagesPage from "./packages/page";
import ReviewsPage from "./review/page";
import GalleryPage from "./components/gallery";
import BookingPage from "./booking/page";

export default function Home() {
  return (
    <>
      <Landingpage />
      <PackagesPage />
      <BookingPage />
      <ReviewsPage />
      <GalleryPage />


    </>

  );
}
