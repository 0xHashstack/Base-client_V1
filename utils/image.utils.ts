import { IMAGE_BASE_PATH } from '@/constant/config';
import { joinTwoString } from './string.utils';

export const getImageUrl = joinTwoString(IMAGE_BASE_PATH);
