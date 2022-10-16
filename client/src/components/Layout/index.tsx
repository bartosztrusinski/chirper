import { ReactNode } from 'react';
import Header from '../Header';

interface Props {
  children?: ReactNode;
  title: string;
}

function Layout({ children, title }: Props) {
  return (
    <>
      <Header title={title} />
      <aside>Left Aside</aside>
      <main>{children}</main>
      <aside>Right Aside</aside>
    </>
  );
}

export default Layout;
