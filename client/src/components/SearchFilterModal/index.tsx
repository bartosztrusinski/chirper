import { MakeGenerics, useNavigate, useSearch } from '@tanstack/react-location';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import Toggle from '../Toggle';
import styles from './styles.module.scss';
import { HiSelector as SelectIcon } from '@react-icons/all-files/hi/HiSelector';

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

type LocationGenerics = MakeGenerics<{
  Search: SearchParams & { dialog?: 'advanced-search' };
}>;

const filterObject = <T,>(
  object: Record<string, T>,
  predicate: (val: T, key: string) => boolean,
): Record<string, T> =>
  Object.fromEntries(
    Object.entries(object).filter(([key, val]) => predicate(val, key)),
  );

const SearchFilterModal = (props: SearchFilterModalProps) => {
  const navigate = useNavigate<LocationGenerics>();
  const search = useSearch<LocationGenerics>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<Inputs>({ defaultValues: search });

  const onSubmit = (inputs: Inputs) => {
    const filteredInputs = filterObject(inputs, (input) => input !== '');
    navigate({ search: { ...filteredInputs, dialog: undefined } });
  };

  return (
    <Modal
      {...props}
      header={<h1 className={styles.heading}>Advanced Search</h1>}
      onAfterOpen={() => reset(search)}
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className={styles.heading}>Sort by</h2>
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
            <SelectIcon className={styles.icon} />
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Accounts</h2>
          <Input
            enterKeyHint='search'
            placeholder='From these accounts'
            {...register('from')}
          />
        </div>

        <div>
          <h2 className={styles.heading}>Filters</h2>

          <div className={styles.toggleGroup}>
            <div className={styles.toggle}>
              <div>Replies included</div>
              <Toggle
                label='Include replies'
                checked={search.includeReplies}
                {...register('includeReplies')}
              />
            </div>

            <div className={styles.toggle}>
              <div>Followed only</div>
              <Toggle
                label='Followed only'
                checked={search.followedOnly}
                {...register('followedOnly')}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Dates</h2>
          <div className={styles.dateGroup}>
            <Input
              type='date'
              placeholder='From'
              className={styles.input}
              {...register('startTime')}
            />
            <Input
              type='date'
              placeholder='To'
              className={styles.input}
              {...register('endTime')}
            />
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
