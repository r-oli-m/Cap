import React from "react";

const Gallery = ({ images }) => {
    return (
        <div className="image-container">
            {images && images.length > 0 ?
                images.map((pic, index) => (
                    <li className="gallery" key={index}>
                        <img
                            className="gallery-screenshot"
                            src={pic}
                            alt="Undefined screenshot from query"
                            width="500"
                        />
                    </li>
                )
                ) : (
                    <div>
                        <h3>Need to take scrnshot!</h3>
                    </div >
                )}
        </div >
    )
}
export default Gallery;