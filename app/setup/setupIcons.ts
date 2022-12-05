import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { library } from '@fortawesome/fontawesome-svg-core';

export const setupIcons = () => {
  library.add(fas, faTelegram, faGithub);
};
