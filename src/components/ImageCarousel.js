import React, {useEffect} from 'react';

const ImageCarousel = ({selectedUserData}) => {
  let slideIndex = 1;
  useEffect(() => {
    showSlides(1);
  }, [selectedUserData]);

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('mySlides');
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    slides[slideIndex - 1].style.display = 'block';
  }
  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }
  return (
    <div className="slideshow-container">
      {selectedUserData.whatsappImageDataSet.map((v) => (
        <div className="mySlides fade">
          <img src={v} width={340} height={540} />
        </div>
      ))}

      <a className="prev" onClick={() => plusSlides(-1)}>
        &#10094;
      </a>
      <a className="next" onClick={() => plusSlides(1)}>
        &#10095;
      </a>
    </div>
  );
};

export default ImageCarousel;
