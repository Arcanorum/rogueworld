import { warning } from '@rogueworld/utils';
import { WebpackRequireValue } from '../shared/types';

// Load the entity icon images.
export default ((context) => {
    const paths = context.keys();
    const values = paths.map(context) as Array<WebpackRequireValue>;
    // Add each class to the list by file name.
    return paths.reduce((list, path, index) => {
        const end = path.split('/').pop()!;
        // Trim the "png" from the end of the file name.
        let fileName = '';
        if (end.slice(end.length - 4) === '.png') {
            fileName = end.slice(0, -4);
        }
        else {
            warning('Cannot load unsupported image file format for icon file:', path);
        }

        list[fileName] = values[index].default.src;

        return list;
    }, {} as { [key: string]: string });
})(require.context('../assets/images/entities', true, /.png$/));
