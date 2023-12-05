import { Tags } from "../Tags";
import { Container } from "./styles";

export function Note({ data, ...rest }) {
  return (
    <Container>
      <h1>{data.title}</h1>

      {data.tags && (
        <footer>
          {data.tags.map((tag) => (
            <Tags key={tag.id} title={tag.name} />
          ))}
        </footer>
      )}
    </Container>
  );
}
