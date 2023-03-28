import styles from './SearchOptionsModal.module.scss';
import Modal, { ModalProps } from '../Modal';
import Heading from '../Heading';
import Input from '../../form/Input';
import Toggle from '../../form/Toggle';
import Button from '../Button';
import { useNavigate, useSearch } from '@tanstack/react-location';
import { useForm } from 'react-hook-form';
import { HiSelector as SelectIcon } from '@react-icons/all-files/hi/HiSelector';
import { LocationGenerics, SearchParams } from '../../../interface';

type Inputs = SearchParams;

const filterObject = <T,>(
  object: Record<string, T>,
  predicate: (val: T, key: string) => boolean,
): Record<string, T> =>
  Object.fromEntries(
    Object.entries(object).filter(([key, val]) => predicate(val, key)),
  );

const SearchOptionsModal = (props: ModalProps) => {
  const navigate = useNavigate<LocationGenerics>();
  const {
    query,
    endTime,
    followedOnly,
    from,
    includeReplies,
    sortOrder,
    startTime,
  } = useSearch<LocationGenerics>();

  const search = {
    query,
    endTime,
    followedOnly: followedOnly ?? false,
    from,
    includeReplies: includeReplies ?? true,
    sortOrder,
    startTime,
  };

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
      header={
        <Heading size='medium'>
          <h1>Advanced Search</h1>
        </Heading>
      }
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
                toggleSize='small'
                checked={search.includeReplies}
                {...register('includeReplies')}
              />
            </div>

            <div className={styles.toggle}>
              <div>Followed only</div>
              <Toggle
                label='Followed only'
                toggleSize='small'
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

export default SearchOptionsModal;
