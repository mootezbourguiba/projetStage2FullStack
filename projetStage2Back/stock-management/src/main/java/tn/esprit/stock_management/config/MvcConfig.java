// src/main/java/tn/esprit/stock_management/config/MvcConfig.java

package tn.esprit.stock_management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cette ligne est la clé.
        // Elle dit à Spring : "Quand une URL commence par /uploads/**"...
        registry.addResourceHandler("/uploads/**")
                // "... va chercher le fichier correspondant dans le dossier 'uploads/' sur le disque dur."
                // "file:" est important pour indiquer que c'est un chemin sur le système de fichiers.
                .addResourceLocations("file:./uploads/");
    }
}