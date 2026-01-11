import yaml from 'js-yaml';
import { type EditorElement } from '../store/editorStore';

export const generateYaml = (elements: EditorElement[], imagePath: string = '/local/floorplan.png') => {
    // Logic to determine image path
    let finalImagePath = imagePath;
    if (imagePath.startsWith('data:')) {
        finalImagePath = '/your/image/path.png';
    }

    const yamlObj = {
        type: 'picture-elements',
        image: finalImagePath,
        elements: elements.map(el => {
            const styleObj = {
                top: `${el.y.toFixed(1)}%`,
                left: `${el.x.toFixed(1)}%`,
                ...el.config.style
            };

            // Explicitly remove color if present (though UI prevents adding it now, existing elements might have it)
            delete styleObj['--paper-item-icon-color'];

            const elementConfig: any = {
                type: el.type === 'label' ? 'state-label' : 'state-icon',
                entity: el.config.entity,
                style: styleObj
            };

            if (el.type === 'label') {
                if (el.config.text) {
                    elementConfig.prefix = el.config.text;
                }
            } else if (el.config.icon) {
                elementConfig.icon = el.config.icon;
            }

            if (el.config.tap_action && el.config.tap_action.action !== 'none') {
                elementConfig.tap_action = el.config.tap_action;
            }

            return elementConfig;
        })
    };

    return yaml.dump(yamlObj, { indent: 2 });
};
