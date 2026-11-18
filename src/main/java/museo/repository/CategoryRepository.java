package museo.repository;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.Category;

@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    // Buscar una categoría exactamente por su nombre (ej: "Pintura")
    public Optional<Category> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    // Verificar si ya existe una categoría con ese nombre (útil al crear)
    public boolean existsByName(String name) {
        return count("name", name) > 0;
    }

    // Listar todas las categorías ordenadas alfabéticamente
    public List<Category> listAllSorted() {
        return list("order by name asc");
    }

}
