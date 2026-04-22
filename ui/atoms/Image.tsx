import { Image as RNImage, ImageProps } from 'react-native';

export const Image = (props: ImageProps) => {
    return (
        <RNImage {...props} />
    );
};
