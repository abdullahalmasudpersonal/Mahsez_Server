import { Request } from 'express';
import { Visitor } from './visitors.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { visitorSearchableFields } from './visitor.constant';

const getVisiotrIntoDB = async (req: Request) => {
  const visitors = await Visitor.find();

  const totalVisitCount = visitors.reduce(
    (sum, visitor) => sum + (visitor.visitCount || 0),
    0,
  );
  return {
    visitors,
    totalVisitCount,
  };
};

const getVisitorsWithFilterWithSearchIntoDB = async (
  query: Record<string, unknown>,
) => {
  const visitorquery = new QueryBuilder(Visitor.find(), query)
    .search(visitorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await visitorquery.countTotal();
  const result = await visitorquery.modelQuery;
  return {
    meta,
    result,
  };
};

export const VisitorServices = {
  getVisiotrIntoDB,
  getVisitorsWithFilterWithSearchIntoDB,
};
