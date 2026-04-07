package com.backend.repository;

import com.backend.entity.Notification;
import com.backend.enums.NotificationType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class NotificationRepositoryImpl implements NotificationRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Notification> findByRecipientWithFilters(Long userId,
                                                         Boolean unread,
                                                         NotificationType type,
                                                         LocalDateTime fromDate,
                                                         LocalDateTime toDate,
                                                         Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<Notification> contentQuery = criteriaBuilder.createQuery(Notification.class);
        Root<Notification> contentRoot = contentQuery.from(Notification.class);
        List<Predicate> predicates = buildPredicates(criteriaBuilder, contentRoot, userId, unread, type, fromDate, toDate);
        contentQuery.select(contentRoot).where(predicates.toArray(new Predicate[0]))
                .orderBy(criteriaBuilder.desc(contentRoot.get("createdAt")));

        TypedQuery<Notification> query = entityManager.createQuery(contentQuery);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<Notification> content = query.getResultList();

        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Notification> countRoot = countQuery.from(Notification.class);
        List<Predicate> countPredicates = buildPredicates(criteriaBuilder, countRoot, userId, unread, type, fromDate, toDate);
        countQuery.select(criteriaBuilder.count(countRoot)).where(countPredicates.toArray(new Predicate[0]));

        Long total = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(content, pageable, total);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder,
                                            Root<Notification> root,
                                            Long userId,
                                            Boolean unread,
                                            NotificationType type,
                                            LocalDateTime fromDate,
                                            LocalDateTime toDate) {
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.equal(root.get("recipientUser").get("id"), userId));

        if (unread != null) {
            predicates.add(unread
                    ? criteriaBuilder.isFalse(root.get("isRead"))
                    : criteriaBuilder.isTrue(root.get("isRead")));
        }

        if (type != null) {
            predicates.add(criteriaBuilder.equal(root.get("type"), type));
        }

        if (fromDate != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
        }

        if (toDate != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), toDate));
        }

        return predicates;
    }
}
