import yaml from 'js-yaml';
import { type EditorElement } from '../store/editorStore';

const formatElement = (el: EditorElement): any => {
    const styleObj: any = {
        top: `${el.y.toFixed(2)}%`,
        left: `${el.x.toFixed(2)}%`,
        ...el.config.style
    };

    // Construct the HA configuration element
    const elementConfig: any = {
        type: el.type,
        ...el.config,
    };

    // Re-apply style with position
    elementConfig.style = styleObj;

    // Handle Nesting (Recursive)
    if (el.elements && el.elements.length > 0) {
        elementConfig.elements = el.elements.map(child => formatElement(child));
    }

    // Filters can be in config or style in HA, standardizing to wherever user put it
    // but usually images use 'filter' directly in config.
    if (el.config.filter) {
        elementConfig.filter = el.config.filter;
    }

    return elementConfig;
};

export const generateYaml = (elements: EditorElement[], imagePath: string = '/local/floorplan.png') => {
    let finalImagePath = imagePath;
    if (imagePath.startsWith('data:')) {
        finalImagePath = '/local/floorplan.png';
    }

    const yamlObj = {
        type: 'picture-elements',
        image: finalImagePath,
        elements: elements.map(el => formatElement(el))
    };

    // Clean up empty objects or nulls if any
    return yaml.dump(yamlObj, {
        indent: 2,
        lineWidth: -1, // Disable line wrapping for cleaner YAML
        noRefs: true
    });
};
