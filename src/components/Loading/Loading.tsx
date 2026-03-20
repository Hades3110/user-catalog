type LoadingProps = {
  text?: string;
};

export function Loading({ text = 'Идёт загрузка...' }: LoadingProps) {
  return <div className="center">{text}</div>;
}

