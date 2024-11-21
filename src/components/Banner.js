import { Container } from "react-bootstrap";
import "./Banner.css";

const Banner = ({ children }) => {
  return (
    <section className="banner d-flex justify-content-center">
      <Container className="text-center">{children}</Container>
    </section>
  );
};

export default Banner;
