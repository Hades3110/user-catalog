type ErrorProps = {
  message: string;
};

export function Error({ message }: ErrorProps) {
  return (
    <div className="center">
      <div>Ошибка: {message}</div>
    </div>
  );
}

