import { MakeGenerics, useNavigate, useSearch } from '@tanstack/react-location';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import Toggle from '../Toggle';
import styles from './styles.module.scss';

type SearchFilterModalProps = ReactModal.Props;

type SearchParams = {
  query: string;
  sortOrder?: 'relevant' | 'recent' | 'popular';
  from?: string;
  includeReplies?: boolean;
  followedOnly?: boolean;
  startTime?: string;
  endTime?: string;
};

type Inputs = SearchParams;

const filterObject = <T,>(
  object: Record<string, T>,
  predicate: (val: T, key: string) => boolean,
): Record<string, T> =>
  Object.fromEntries(
    Object.entries(object).filter(([key, val]) => predicate(val, key)),
  );

const SearchFilterModal = (props: SearchFilterModalProps) => {
  const navigate = useNavigate();
  const search = useSearch<MakeGenerics<{ Search: SearchParams }>>();

  const getDefaultValues = () => ({
    sortOrder: search.sortOrder ?? 'relevant',
    from: search.from ?? '',
    includeReplies: search.includeReplies ?? true,
    followedOnly: search.followedOnly ?? false,
    startTime: search.startTime ?? '',
    endTime: search.endTime ?? '',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<Inputs>({ defaultValues: getDefaultValues() });

  const onSubmit = (inputs: Inputs) => {
    const filteredInputs = filterObject(
      inputs,
      (input) => input !== '',
    ) as Omit<SearchParams, 'query'>;

    navigate({
      to: '/search',
      search: () => ({ query: search.query, ...filteredInputs }),
    });
  };

  return (
    <Modal
      {...props}
      title='Advanced Search'
      onAfterOpen={() => reset(getDefaultValues())}
      onRequestClose={() => navigate({ to: '/search', search: true })}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3 className={styles.heading}>Sort by</h3>
          <div className={styles.selectContainer}>
            <select
              autoFocus
              className={styles.select}
              {...register('sortOrder')}
            >
              <option value='relevant'>Relevant</option>
              <option value='popular'>Popular</option>
              <option value='recent'>Latest</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className={styles.heading}>Accounts</h3>
          <Input placeholder='From these accounts' {...register('from')} />
        </div>

        <div>
          <h3 className={styles.heading}>Filters</h3>

          <div className={styles.toggleGroup}>
            <div className={styles.toggle}>
              <div>Replies included</div>
              <Toggle
                title='include replies'
                defaultChecked={getDefaultValues().includeReplies}
                {...register('includeReplies')}
              />
            </div>

            <div className={styles.toggle}>
              <div>Followed only</div>
              <Toggle
                title='followed only'
                defaultChecked={getDefaultValues().followedOnly}
                {...register('followedOnly')}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className={styles.heading}>Dates</h3>
          <div className={styles.dateGroup}>
            <Input placeholder='From' type='date' {...register('startTime')} />
            <Input placeholder='To' type='date' {...register('endTime')} />
          </div>
        </div>

        <Button
          disabled={!isValid}
          type='submit'
          className={styles.submitButton}
        >
          Apply
        </Button>
      </form>
    </Modal>
  );
};

export default SearchFilterModal;
