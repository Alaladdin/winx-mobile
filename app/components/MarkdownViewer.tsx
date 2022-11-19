import Markdown from 'react-native-markdown-display';
import { StyleSheet } from 'react-native';
import theme from '@/theme';

interface IMarkdownViewerProps {
  children: string;
}

export function MarkdownViewer({ children }: IMarkdownViewerProps) {
  return (
    <Markdown style={ styles } mergeStyle={ false }>
      { children }
    </Markdown>
  );
}

const styles = StyleSheet.create({
  body: {
    color: theme.colors.onBackground,
  },
  link: {
    color: theme.colors.primary,
  },
  code_block: {
    paddingVertical  : theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    fontFamily       : 'monospace',
    borderRadius     : theme.roundness,
    backgroundColor  : theme.colors.elevation.level1,
  },
  code_inline: {
    paddingVertical  : theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    fontFamily       : 'monospace',
    borderRadius     : theme.roundness,
    backgroundColor  : theme.colors.elevation.level1,
  },
  fence: {
    paddingVertical  : theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    fontFamily       : 'monospace',
    borderRadius     : theme.roundness,
    backgroundColor  : theme.colors.elevation.level1,
  },
  image: {
    borderRadius: theme.roundness,
    overflow    : 'hidden',
  },
  blockquote: {
    paddingVertical  : theme.spacing.extraSmall,
    paddingHorizontal: theme.spacing.medium,
    borderRadius     : theme.roundness,
    borderLeftWidth  : 6,
    borderColor      : theme.colors.secondaryContainer,
    backgroundColor  : theme.colors.elevation.level1,
  },
  table: {
    borderWidth : 2,
    borderColor : theme.colors.secondaryContainer,
    borderRadius: theme.roundness,
  },
  th: {
    flex: 1,
  },
  tr: {
    flexDirection    : 'row',
    padding          : theme.spacing.extraSmall,
    borderColor      : theme.colors.secondaryContainer,
    borderBottomWidth: 2,
  },
  td: {
    flex: 1,
  },
  hr: {
    height         : 2,
    backgroundColor: theme.colors.secondaryContainer,
  },
});
