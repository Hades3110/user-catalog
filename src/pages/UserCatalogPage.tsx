import { Pagination } from '../components/Pagination/Pagination';
import { SearchInput } from '../components/SearchInput/SearchInput';
import { UserCard } from '../components/UserCard/UserCard';
import { useUserCatalog } from '../hooks/useUserCatalog';
import type { DummyUser } from '../types/dummyjson';
import { withListStatus } from '../hoc/withListStatus';

function UsersGrid({ items }: { items: DummyUser[] }) {
  return (
    <div className="usersGrid">
      {items.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
    </div>
  );
}

const UsersGridWithStatus = withListStatus<DummyUser, {}>(UsersGrid);

export function UserCatalogPage() {
  const { draftQuery, setDraftQuery, onPageChange, page, users, total, pageCount, loading, error } =
    useUserCatalog();

  return (
    <div className="page">
      <div className="topBar">
        <div className="titleBlock">
          <h1>Каталог пользователей</h1>
          <p>DummyJSON API • поиск по имени и пагинация</p>
        </div>

        <SearchInput value={draftQuery} onChange={setDraftQuery} />
      </div>

      <div className="contentCard">
        <div className="toolbar">
          <div className="statusLine">
            {loading ? (
              'Загрузка...'
            ) : error ? (
              <span style={{ color: 'rgba(255, 140, 140, 0.95)' }}>{error}</span>
            ) : (
              <>
                Найдено: <b>{total}</b>
              </>
            )}
          </div>
        </div>

        <UsersGridWithStatus
          items={users}
          loading={loading}
          error={error}
          emptyText="Пользователи не найдены"
        />

        <Pagination currentPage={page} pageCount={pageCount} onPageChange={onPageChange} />
      </div>
    </div>
  );
}

